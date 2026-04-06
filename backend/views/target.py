from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from asgiref.sync import async_to_sync

from backend.models import Task
from backend.utils.graphRAGService import GraphRAGService
from backend.utils.graphrag_utils import format_context_data_to_data_tag, generate_entity_relationship_graph

from backend.utils.prompt.local_search_prompt import GENERATE_SUB_TARGET_PROMPT

SEARCH_ENGINE = GraphRAGService.get_engine(GENERATE_SUB_TARGET_PROMPT)

"""
 Response Status List:
 1. 200: success
 2. 202: success but no process
 2. 400: client error
 3. 500: server error
"""


# get Task Target
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def get_task_target(request):
    try:
        task_id = request.data.get('task_id')

        task_data = Task.objects.get(id=task_id)
        target_data = task_data.target

        target_titles = target_data.targets
        target_descriptions = target_data.descriptions
        target_sub_target_list = target_data.sub_target_list
        target_nodes = target_data.target_nodes
        target_relations = target_data.target_relations

        return Response({
            'target_titles': target_titles,
            'target_descriptions': target_descriptions,
            'sub_target_list': target_sub_target_list,
            'target_nodes': target_nodes,
            'target_relations': target_relations
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'get tasks experience Error: {e}')
        return Response({'get tasks experience Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# save Task Target
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def save_task_target(request):
    try:
        task_id = request.data.get('task_id')
        select_node = int(request.data.get('select_node'))
        title = request.data.get('target_title')
        description = request.data.get('target_description')
        sub_target_list = request.data.get('sub_target_list')

        task_data = Task.objects.get(id=task_id)
        target_data = task_data.target

        data_targets = target_data.targets
        data_descriptions = target_data.descriptions
        data_sub_target_list = [] if target_data.sub_target_list is None else target_data.sub_target_list

        if len(data_targets) > select_node:
            data_targets[select_node] = title
            data_descriptions[select_node] = description
            data_sub_target_list[select_node] = sub_target_list
        else:
            for i in range(len(data_targets), select_node + 1):
                if i == select_node:
                    data_targets.append(title)
                    data_descriptions.append(description)
                    data_sub_target_list.append(sub_target_list)
                else:
                    data_targets.append('empty')
                    data_descriptions.append('empty')
                    data_sub_target_list.append({'title': 'empty', 'description': 'empty'})

        target_data.targets = data_targets
        target_data.descriptions = data_descriptions
        target_data.sub_target_list = data_sub_target_list
        target_data.save()
        return Response({'message': 'success'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'upload task target Error: {e}')
        return Response({'upload task target Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# generate sub target graph
@ensure_csrf_cookie
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def generate_sub_target_graph(request):
    try:
        task_id = request.data.get('task_id')
        select_node_index = int(request.data.get('select_node'))
        title = request.data.get('target_title')
        description = request.data.get('target_description')

        query = GENERATE_SUB_TARGET_PROMPT(title, description)

        search_func = async_to_sync(SEARCH_ENGINE.search)
        result_object = search_func(
            query=query,
        )
        output_text = result_object.response
        data_tag = format_context_data_to_data_tag(result_object.context_data)
        graph_data = generate_entity_relationship_graph(data_tag, task_id)

        task_data = Task.objects.get(id=task_id)
        data_target = task_data.target

        data_target_nodes = [] if data_target.target_nodes is None else data_target.target_nodes
        data_target_relations = [] if data_target.target_relations is None else data_target.target_relations

        if len(data_target_nodes) > select_node_index:
            data_target_nodes[select_node_index] = graph_data['nodes']
            data_target_relations[select_node_index] = graph_data['edges']
        else:
            for i in range(len(data_target_nodes), select_node_index + 1):
                if i == select_node_index:
                    data_target_nodes.append(graph_data['nodes'])
                    data_target_relations.append(graph_data['edges'])
                else:
                    data_target_nodes.append('empty')
                    data_target_relations.append('empty')

        data_target.target_nodes = data_target_nodes
        data_target.target_relations = data_target_relations
        data_target.save()

        return Response({'response': output_text, 'graph_data': graph_data}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f'generate sub target graph Error: {e}')
        return Response({'generate sub target graph Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
