from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from gvm.transforms import EtreeTransform
import json

socket_path = "/tmp/gvm/gvmd/gvmd.sock"
connection = UnixSocketConnection(path=socket_path)
transform = EtreeTransform()

with Gmp(connection=connection, transform=transform) as gmp:
    gmp.authenticate("admin", "nohnoh")

    scan_configs = gmp.get_scan_configs()
    result = []

    # 🛠️ Corrigé ici : chercher <config> au lieu de <scan_config>
    for config in scan_configs.findall("config"):
        result.append({
            "id": config.get("id"),
            "name": config.findtext("name"),
            "comment": config.findtext("comment"),
            "nvt_count": config.findtext("nvt_count")
        })

    print(json.dumps(result))