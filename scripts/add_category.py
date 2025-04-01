import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

def read_prompt():
    """Read the prompt from prompt.txt"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(script_dir, 'prompt.txt')
    with open(prompt_path, 'r') as f:
        return f.read()

def process_top_100_list(input_text):
    try:
        prompt = read_prompt()
        full_prompt = prompt + "\n" + input_text

        response = client.models.generate_content(model="gemini-2.0-flash", contents=full_prompt)
        query = response.text.strip()
        return query
    except Exception as e:
        print(f"Error processing list: {str(e)}")
        return None

def main():
    print("Please enter your unformatted top 100 list (press Ctrl+Z when finished):")
    input_lines = []
    try:
        while True:
            line = input()
            input_lines.append(line)
    except EOFError:
        pass
    
    input_text = "\n".join(input_lines)
    
    print("\nProcessing list...")
    
    query = process_top_100_list(input_text)
    
    if query:
        print("\nGenerated Supabase Query:")
        print(query)
    else:
        print("Failed to generate query.")

if __name__ == "__main__":
    main()