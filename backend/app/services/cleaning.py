import re

def clean_text(text: str) -> str:
    """
    Cleans and normalizes text by removing extra whitespace and special characters.
    """
    if not text:
        return ""
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove non-printable characters
    text = ''.join(char for char in text if char.isprintable())
    
    return text
