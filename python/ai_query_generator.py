import os
import sys
from dotenv import load_dotenv

load_dotenv()

def generate_query(name, company, designation):
    """
    Generate an AI-enhanced search query for LinkedIn profile using Google Gemini
    Name is optional - if not provided, searches for all people with that role at the company
    """
    # Basic query construction - name is optional
    if name and name.strip():
        query = f'"{name}" "{company}" "{designation}" site:linkedin.com/in'
    else:
        # Search for role at company without specific name
        query = f'"{company}" "{designation}" site:linkedin.com/in'
    
    # Optional: Use Google Gemini to enhance query (if API key available)
    try:
        gemini_key = os.getenv('GEMINI_API_KEY')
        if gemini_key:
            import google.generativeai as genai
            
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            
            if name and name.strip():
                prompt = f"""Generate an optimal Google search query to find a LinkedIn profile.
            
Person Details:
- Name: {name}
- Company: {company}
- Designation: {designation}

Generate a concise search query that will find their LinkedIn profile. Include site:linkedin.com/in in the query."""
            else:
                prompt = f"""Generate an optimal Google search query to find LinkedIn profiles of people with a specific role at a company.

Search Criteria:
- Company: {company}
- Designation: {designation}
- Find: Multiple people with this role at this company

Generate a concise search query that will find multiple LinkedIn profiles. Include site:linkedin.com/in in the query."""
            
            response = model.generate_content(prompt)
            enhanced_query = response.text.strip()
            
            # Ensure site:linkedin.com/in is included
            if 'site:linkedin.com/in' not in enhanced_query:
                enhanced_query += ' site:linkedin.com/in'
            
            return enhanced_query
    except Exception as e:
        print(f"Gemini enhancement failed, using basic query: {str(e)}", file=sys.stderr)
    
    return query
