import sys
import json
from ai_query_generator import generate_query
from linkedin_extractor import extract_linkedin_urls

def main():
    try:
        # Read input from command line
        input_data = json.loads(sys.argv[1])
        
        name = input_data.get('name', '')
        company = input_data.get('company', '')
        designation = input_data.get('designation', '')
        
        # Log input for debugging
        print(f"Processing: name='{name}', company='{company}', designation='{designation}'", file=sys.stderr)
        
        # Generate AI-enhanced search query
        query = generate_query(name, company, designation)
        print(f"Generated query: {query}", file=sys.stderr)
        
        # Extract LinkedIn URLs
        result = extract_linkedin_urls(query, name, company, designation)
        print(f"Found {len(result.get('all_urls', []))} URLs", file=sys.stderr)
        
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        print(f"Error in main: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        
        error_result = {
            "generated_query": "",
            "linkedin_url": None,
            "all_urls": [],
            "confidence_score": 0.0,
            "search_type": "error",
            "error": str(e)
        }
        print(json.dumps(error_result))
        sys.exit(1)

if __name__ == "__main__":
    main()
