# Simple knowledge graph representing prerequisite relationships
# Parent -> Children (Parent is a prerequisite for Child)

# Curriculum Structure:
# Physics:
#   - Vectors -> Kinematics -> Newton's Laws -> Work Energy -> Momentum
# Math:
#   - Algebra -> Geometry -> Trigonometry -> Calculus
# Chemistry:
#   - Atoms -> Periodic Table -> Bonding -> Reactions

PREREQUISITES = {
    # Physics Core
    "kinematics": ["vectors"],
    "newtons_laws": ["kinematics"],
    "work_energy": ["newtons_laws"],
    "momentum": ["newtons_laws"],
    "gravitation": ["newtons_laws", "kinematics"],
    "motion": ["kinematics", "vectors"],
    "optics": ["geometry"],
    "ohms_law": ["atoms"],
    "thermodynamics": ["work_energy", "atoms"],
    
    # Advanced Physics
    "fluid_dynamics": ["newtons_laws", "work_energy"],
    "aerodynamics": ["fluid_dynamics"],
    "rocketry": ["aerodynamics", "momentum", "gravitation"],
    "relativity": ["gravitation", "optics"],
    "quantum_mechanics": ["atoms", "optics", "algebra"],

    # Math Core
    "geometry": ["algebra"],
    "trigonometry": ["geometry", "algebra"],
    "calculus": ["trigonometry", "algebra"],
    "differential_equations": ["calculus"],
    "linear_algebra": ["vectors", "algebra"],

    # Chemistry Core
    "atoms": ["algebra"], # Fundamental
    "periodic_table": ["atoms"],
    "bonding": ["periodic_table", "atoms"],
    "reactions": ["bonding"],
    "organic_chem": ["bonding"],
    
    # AI/CompSci
    "algorithms": ["algebra"],
    "machine_learning": ["linear_algebra", "calculus", "algorithms"]
}

TOPIC_METADATA = {
    # Physics
    "vectors": {"domain": "physics", "name": "Vectors", "difficulty": 0.3, "description": "Magnitude and direction basics."},
    "kinematics": {"domain": "physics", "name": "Kinematics", "difficulty": 0.4, "description": "Motion in 1D and 2D."},
    "newtons_laws": {"domain": "physics", "name": "Newton's Laws", "difficulty": 0.6, "description": "Forces and motion constraints."},
    "work_energy": {"domain": "physics", "name": "Work & Energy", "difficulty": 0.5, "description": "Conservation laws."},
    "momentum": {"domain": "physics", "name": "Momentum", "difficulty": 0.5, "description": "Collisions and impulse."},
    "gravitation": {"domain": "physics", "name": "Gravitation", "difficulty": 0.7, "description": "Orbits and universal force."},
    "optics": {"domain": "physics", "name": "Ray Optics", "difficulty": 0.6, "description": "Light, mirrors, and lenses."},
    "motion": {"domain": "physics", "name": "Projectile Motion", "difficulty": 0.5, "description": "2D Kinematics."},
    "ohms_law": {"domain": "physics", "name": "Ohm's Law", "difficulty": 0.3, "description": "Current and Voltage."},
    "thermodynamics": {"domain": "physics", "name": "Thermodynamics", "difficulty": 0.7, "description": "Heat, work, and entropy."},
    "fluid_dynamics": {"domain": "physics", "name": "Fluid Dynamics", "difficulty": 0.7, "description": "Flow, pressure, and Bernoulli."},
    "aerodynamics": {"domain": "physics", "name": "Aerodynamics", "difficulty": 0.8, "description": "Forces on flight bodies."},
    "rocketry": {"domain": "physics", "name": "Rocketry", "difficulty": 0.9, "description": "Propulsion and orbital mechanics."},
    "relativity": {"domain": "physics", "name": "Relativity", "difficulty": 0.9, "description": "Space-time and gravity."},
    "quantum_mechanics": {"domain": "physics", "name": "Quantum Mechanics", "difficulty": 0.9, "description": "Wave functions and uncertainty."},
    
    # Math
    "algebra": {"domain": "math", "name": "Algebra", "difficulty": 0.3, "description": "Equations and variables."},
    "geometry": {"domain": "math", "name": "Geometry", "difficulty": 0.4, "description": "Shapes, sizes, and properties."},
    "trigonometry": {"domain": "math", "name": "Trigonometry", "difficulty": 0.5, "description": "Triangles and waves."},
    "calculus": {"domain": "math", "name": "Calculus", "difficulty": 0.8, "description": "Rates of change and areas."},
    "differential_equations": {"domain": "math", "name": "Diff. Equations", "difficulty": 0.9, "description": "Modeling change."},
    "linear_algebra": {"domain": "math", "name": "Linear Algebra", "difficulty": 0.7, "description": "Matrices and vector spaces."},

    # Chemistry
    "atoms": {"domain": "chemistry", "name": "Atomic Structure", "difficulty": 0.2, "description": "Protons, neutrons, electrons."},
    "periodic_table": {"domain": "chemistry", "name": "Periodic Table", "difficulty": 0.3, "description": "Elements and trends."},
    "bonding": {"domain": "chemistry", "name": "Chemical Bonding", "difficulty": 0.5, "description": "Ionic and covalent bonds."},
    "reactions": {"domain": "chemistry", "name": "Reactions", "difficulty": 0.4, "description": "Stoichiometry and types."},
    "organic_chem": {"domain": "chemistry", "name": "Organic Chemistry", "difficulty": 0.8, "description": "Carbon-based compounds."},
    
    # CS
    "algorithms": {"domain": "cs", "name": "Algorithms", "difficulty": 0.6, "description": "Logic and sorting."},
    "machine_learning": {"domain": "cs", "name": "Machine Learning", "difficulty": 0.9, "description": "Neural networks and data."},
}

def get_prerequisites(topic_id):
    return PREREQUISITES.get(topic_id, [])

def get_dependent_topics(topic_id):
    # Reverse lookup: find topics where topic_id is a prerequisite
    dependents = []
    for topic, prereqs in PREREQUISITES.items():
        if topic_id in prereqs:
            dependents.append(topic)
    return dependents
