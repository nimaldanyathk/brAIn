from knowledge_graph import TOPIC_METADATA
print("Loaded Topics:", len(TOPIC_METADATA))
if "rocketry" in TOPIC_METADATA:
    print("SUCCESS: Rocketry found!")
else:
    print("FAILURE: Rocketry missing.")
