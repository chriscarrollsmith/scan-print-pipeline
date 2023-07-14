from os import getenv
from dotenv import load_dotenv
import openai
import urllib.request

load_dotenv()
openai.api_key = getenv("OPENAI_API_KEY")

PROMPT = "A cute dog wearing funny sunglasses"

response = openai.Image.create_edit(
  image=open("dog.png", "rb"),
  mask=open("mask.png", "rb"),
  prompt=PROMPT,
  n=1,
  size="1024x1024"
)
image_url = response['data'][0]['url']

urllib.request.urlretrieve(image_url, "dogsunglasses.png")

print("Success! Image saved to dogsunglasses.png")