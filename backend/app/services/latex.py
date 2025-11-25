import os
from jinja2 import Environment, FileSystemLoader
from app.models.resume import Resume

TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

# Custom filter to escape LaTeX special characters
def latex_escape(value):
    if not isinstance(value, str):
        return value
    chars = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}',
    }
    return ''.join(chars.get(c, c) for c in value)

env.filters['latex_escape'] = latex_escape

def generate_latex(resume: Resume, template_name: str = "resume.tex") -> str:
    template = env.get_template(template_name)
    return template.render(resume=resume)
