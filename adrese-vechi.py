# Framer lp-reclama-tv (digital-meniu/1-6) cere adresele vechi; le servim cu produsele noi ale TV-ului (19.10, Mihai: „pe tv imi spui eror 404”)
import os, shutil
R = os.path.dirname(os.path.abspath(__file__))
H = {"tv1": {"121-meniu-mici": "217-paste-carbonara", "122-meniu-pui-shanghai": "219-paste-bologneze", "123-meniu-pui-crispy": "217-paste-carbonara"},
     "tv2": {"tv2-124-meniu-snitel-de-pui": "268-ciuperci-la-gratar", "tv2-125-meniu-pulpa-de-pui": "111-bulgareasca", "tv2-126-meniu-ceafa-de-porc": "268-ciuperci-la-gratar"},
     "tv3": {"127-meniu-aripioare": "112-greceasca", "130-meniu-chiftele": "201-mic-dejun-taranesc", "132-meniu-cascaval-pane": "112-greceasca"},
     "tv4": {"152-bulz-ardelenesc": "065-musaca"},
     "tv5": {"109-cartofi-gratinati": "203-mic-dejun-la-popoteria"},
     "tv6": {"229-papanasi": "157-clatite-brasovene", "181-platou-popoteria": "283-crumble-cu-mere", "095-cappuccino": "157-clatite-brasovene"}}
for tv, m in H.items():
    for vechi, nou in m.items():
        shutil.copyfile(f"{R}/{tv}/{nou}.html", f"{R}/{tv}/{vechi}.html")
        print(tv, vechi, "<-", nou)
