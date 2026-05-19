import os
from dotenv import load_dotenv

load_dotenv()

# DATABASE_URL = os.getenv("DATABASE_URL") TODO: DEV
DATABASE_URL = os.environ["DATABASE_URL"]