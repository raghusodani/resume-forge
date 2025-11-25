import os
import subprocess
import tempfile
import shutil

def compile_pdf(latex_content: str) -> bytes:
    """
    Compiles LaTeX content to PDF and returns the binary data.
    """
    with tempfile.TemporaryDirectory() as temp_dir:
        tex_file = os.path.join(temp_dir, "resume.tex")
        
        with open(tex_file, "w") as f:
            f.write(latex_content)
            
        # Run pdflatex twice to resolve references
        for _ in range(2):
            process = subprocess.run(
                ["pdflatex", "-interaction=nonstopmode", "resume.tex"],
                cwd=temp_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
        pdf_file = os.path.join(temp_dir, "resume.pdf")
        
        if os.path.exists(pdf_file):
            with open(pdf_file, "rb") as f:
                return f.read()
        else:
            # Return error log if PDF not created
            log_file = os.path.join(temp_dir, "resume.log")
            if os.path.exists(log_file):
                with open(log_file, "r") as f:
                    raise Exception(f"LaTeX Compilation Error:\n{f.read()}")
            raise Exception("PDF generation failed unknown error")
