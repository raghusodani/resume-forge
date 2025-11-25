import pypdf
import io

def inspect_pdf_text():
    pdf_path = "Raghu_Raj_Sodani_Final.pdf"
    print(f"Inspecting {pdf_path}...")
    
    try:
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
        print("\n--- Extracted Text Start ---")
        print(text)
        print("--- Extracted Text End ---\n")
        
        print("Checking for specific keywords:")
        print(f"Contains 'github': {'github' in text.lower()}")
        print(f"Contains 'linkedin': {'linkedin' in text.lower()}")
        
        # Check for annotations (links)
        print("\nChecking for Annotations (Hyperlinks):")
        for page in reader.pages:
            if "/Annots" in page:
                for annot in page["/Annots"]:
                    obj = annot.get_object()
                    if "/A" in obj and "/URI" in obj["/A"]:
                        print(f"Found Link: {obj['/A']['/URI']}")
                        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_pdf_text()
