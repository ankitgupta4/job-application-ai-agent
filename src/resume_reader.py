from docx import Document

def read_resume(file_path: str) -> str:
    """
    Read resume docx and return plain text.
    """

    doc = Document(file_path)

    paragraphs = []

    for para in doc.paragraphs:
        text = para.text.strip()

        if text:
            paragraphs.append(text)

    return "\n".join(paragraphs)