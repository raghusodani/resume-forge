import logging
from typing import Any, Dict, Optional
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.services.llm_factory import LLMFactory

logger = logging.getLogger(__name__)

class LLMClient:
    """
    Service class for interacting with the configured LLM provider.
    Uses LangChain for abstraction and robust JSON parsing.
    """
    
    def __init__(self):
        self.llm = None
        self.parser = JsonOutputParser()
        self._initialize_llm()

    def _initialize_llm(self):
        """Attempts to initialize the LLM via the factory."""
        try:
            self.llm = LLMFactory.create_llm()
            logger.info("LLM initialized successfully.")
        except Exception as e:
            logger.error(f"LLM initialization failed: {e}")
            self.llm = None

    async def generate_json(self, prompt_text: str) -> Dict[str, Any]:
        """
        Generates a JSON response from the LLM based on the prompt.
        
        Args:
            prompt_text: The input prompt for the LLM.
            
        Returns:
            Dict[str, Any]: The parsed JSON response, or an empty dict on error.
        """
        if not self.llm:
            # Try to re-initialize in case config changed or transient error
            self._initialize_llm()
            if not self.llm:
                logger.error("LLM client is not available.")
                return {"error": "LLM service unavailable"}
        
        try:
            # Create a prompt template that enforces JSON output
            template = """
            {prompt}
            
            IMPORTANT: Return ONLY a valid JSON object. Do not include any explanations, markdown formatting, or code blocks.
            """
            
            prompt = PromptTemplate(
                template=template,
                input_variables=["prompt"]
            )
            
            # Create chain: Prompt -> LLM -> JSON Parser
            chain = prompt | self.llm | self.parser
            
            result = await chain.ainvoke({"prompt": prompt_text})
            return result
            
        except Exception as e:
            logger.error(f"Error generating JSON from LLM: {e}")
            return {}

# Global instance
llm_client = LLMClient()
