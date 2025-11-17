from gvm.connections import UnixSocketConnection
from gvm.protocols.gmp import Gmp
from gvm.transforms import EtreeTransform

from lxml import etree
import sys
import datetime
import os
import time

# --- Vérification des arguments ---
if len(sys.argv) < 3:
    print("❌ Usage: python3 launch_scan.py <IP_ADDRESS> <SCAN_CONFIG_ID>")
    sys.exit(1)

ip_address = sys.argv[1]
scan_config_id = sys.argv[2]  # L'ID de la configuration de scan (passé depuis l'API)
timestamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")

# --- Connexion à gvmd via socket Unix ---
socket_path = "/tmp/gvm/gvmd/gvmd.sock"
connection = UnixSocketConnection(path=socket_path)
transform = EtreeTransform()

with Gmp(connection=connection, transform=transform) as gmp:
    gmp.authenticate("admin", "nohnoh")

    # --- Création du target ---
    target_name = f"Target_{ip_address}_{timestamp}"
    target_resp = gmp.create_target(
        name=target_name,
        hosts=[ip_address],
        port_list_id="33d0cd82-57c6-11e1-8ed1-406186ea4fc5"
    )
    target_id = target_resp.get("id")

    # --- Création de la tâche ---
    task_name = f"Scan_{ip_address}_{timestamp}"
    task_resp = gmp.create_task(
        name=task_name,
        config_id=scan_config_id,  # Utilisation de l'ID dynamique du scan
        target_id=target_id,
        scanner_id="08b69003-5fc2-4037-a479-93b440211c73"
    )
    task_id = task_resp.get("id")

    # --- Lancement de la tâche ---
    start_resp = gmp.start_task(task_id)
    report_id = start_resp[0].text

    # --- Suivi du statut ---
    print("⏳ Waiting for scan to complete...", flush=True)
    time.sleep(10)
    status = ""
    final_statuses = ["Done", "Stopped", "Interrupted", "Canceled", "Failed"]

    while status not in final_statuses:
        try:
            task_info = gmp.get_task(task_id=task_id)
            status = task_info.find(".//status").text
            print(status, flush=True)
        except Exception as e:
            print(f"❌ Error fetching status: {e}", flush=True)

        if status not in final_statuses:
            time.sleep(10)

    # --- Récupération du rapport final ---
    report = gmp.get_report(
        report_id=report_id,
        report_format_id="a994b278-1f62-11e1-96ac-406186ea4fc5",
        details=True
    )

    # --- Sauvegarde du rapport XML dans la VM ---
    report_dir = "/home/nohnoh/rapports"
    os.makedirs(report_dir, exist_ok=True)
    xml_filename = f"rapport_{ip_address}_{timestamp}.xml"
    xml_path = f"{report_dir}/{xml_filename}"

    with open(xml_path, "w", encoding="utf-8") as f:
        xml_string = etree.tostring(report, pretty_print=True, encoding="unicode")
        f.write(xml_string)

    # --- Retour du chemin vers le backend ---
    print(xml_path, flush=True)