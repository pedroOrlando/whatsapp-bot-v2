from rembg import remove
from PIL import Image
import sys

def byebg(input_path, outputpath):
    original_img = Image.open(input_path)
    no_bg_img = remove(original_img)
    no_bg_img.save(outputpath)


if __name__ == "__main__":
    #valida o input
    if len(sys.argv) < 2:
        print("Usage: python byebg.py <input_path> <output_path>")
        sys.exit(1)

    #monta os caminhos de origem e destino
    input_path = "./src/config/imgs/background_remover/1.Origem("+sys.argv[1]+").jpg"
    output_path = "./src/config/imgs/background_remover/2.Processado("+sys.argv[1]+").png"

    #remove o fundo
    byebg(input_path, output_path)

    