from groq import Groq
from app.config import settings
from loguru import logger
from tenacity import retry, stop_after_attempt, wait_exponential


class LLMClient:
    """
    Abstraction over Groq API.
    Swapping to OpenAI/Anthropic = change this file only.
    """

    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.primary_model = settings.groq_model_primary
        self.fast_model = settings.groq_model_fast
        logger.info(f"LLM client initialized | primary={self.primary_model}")

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    def complete(
        self,
        prompt: str,
        system: str = "",
        use_fast_model: bool = False,
        temperature: float = None,
        max_tokens: int = None,
    ) -> str:
        """
        Single-turn completion. Returns response text.
        use_fast_model=True uses llama-3.1-8b for cheaper/faster calls.
        """
        model = self.fast_model if use_fast_model else self.primary_model
        temp = temperature if temperature is not None else settings.groq_temperature
        tokens = max_tokens if max_tokens is not None else settings.groq_max_tokens

        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        logger.debug(f"LLM call | model={model} | prompt_len={len(prompt)}")

        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temp,
            max_tokens=tokens,
        )

        result = response.choices[0].message.content
        logger.debug(f"LLM response | len={len(result)}")
        return result

    def complete_with_history(
        self,
        messages: list[dict],
        system: str = "",
        use_fast_model: bool = False,
    ) -> str:
        """
        Multi-turn completion with full message history.
        messages = [{"role": "user"/"assistant", "content": "..."}]
        """
        model = self.fast_model if use_fast_model else self.primary_model

        full_messages = []
        if system:
            full_messages.append({"role": "system", "content": system})
        full_messages.extend(messages)

        response = self.client.chat.completions.create(
            model=model,
            messages=full_messages,
            temperature=settings.groq_temperature,
            max_tokens=settings.groq_max_tokens,
        )
        return response.choices[0].message.content


# Singleton — import this everywhere
llm_client = LLMClient()