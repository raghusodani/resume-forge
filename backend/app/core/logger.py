# logger configuration for the backend
import logging
import sys

# Create a logger
logger = logging.getLogger("resume_tailor")
logger.setLevel(logging.INFO)

# Create console handler with a higher log level
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.INFO)

# Create formatter and add it to the handlers
formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
ch.setFormatter(formatter)

# Add the handlers to the logger
if not logger.handlers:
    logger.addHandler(ch)

# Export logger for import elsewhere
__all__ = ["logger"]
