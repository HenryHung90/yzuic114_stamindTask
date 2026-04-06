from backend.utils.prompt.base_prompt import get_base_prompt
from backend.utils.prompt.base_target_prompt import get_base_prompt as get_base_target_prompt

WHACK_A_MOLE_GAME_PROMPT = get_base_prompt(course_title="打地鼠遊戲")
TODOLIST_PROMPT = get_base_prompt(course_title="待辦清單")


def GENERATE_SUB_TARGET_PROMPT(target_title, target_description):
    return get_base_target_prompt(target_title=target_title, target_description=target_description)
