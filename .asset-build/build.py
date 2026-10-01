from pathlib import Path
from io import BytesIO
from urllib.parse import urlparse
import json
import subprocess
from PIL import Image, ImageOps

root = Path.cwd()
manifest = json.loads((root / '.asset-build/manifest.json').read_text())
count = 0
for item in manifest:
    source = item['source']
    if source.startswith('https://'):
        assert urlparse(source).hostname == 'mir-s3-cdn-cf.behance.net'
        data = subprocess.check_output(['curl', '--fail', '--location', '--proto', '=https', '--retry', '2', '--max-time', '60', '--silent', '--show-error', source])
    else:
        source_path = (root / source).resolve()
        assert source_path.is_relative_to(root.resolve())
        data = source_path.read_bytes()
    with Image.open(BytesIO(data)) as original:
        original = ImageOps.exif_transpose(original).convert('RGB')
        for target in item['targets']:
            destination = (root / target['path']).resolve()
            assert destination.is_relative_to((root / 'images').resolve())
            destination.parent.mkdir(exist_ok=True)
            width = target['width']
            height = round(original.height * width / original.width)
            assert height == target['height']
            original.resize((width, height), Image.Resampling.LANCZOS).save(destination, 'WEBP', quality=82, method=6)
            with Image.open(destination) as check:
                check.verify()
            count += 1
assert count == 209
print(f'Built and verified {count} responsive images.')
