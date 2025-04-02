import os

# 檢測是否在 Render 環境中
if 'RENDER' in os.environ:
    from .render import *
else:
    from .local import *