// Fonction pour calculer les positions des expériences sans chevauchement
export function getPositionedExperiences(experiences: any[]) {
    const positioned = [];
    const lanes: any[] = [];
    
    // Calculer les années min et max automatiquement
    const allYears = experiences.flatMap(exp => [exp.startYear, exp.endYear]);
    const minYear = Math.min(...allYears);
    const maxYear = Math.max(...allYears);
    const yearRange = maxYear - minYear + 1;
    
    // Trier les expériences par année de début
    const sortedExperiences = [...experiences].sort((a, b) => a.startYear - b.startYear);
    
    // Calculer dynamiquement le nombre de lanes nécessaires
    // Analyser les chevauchements potentiels pour déterminer le nombre optimal de lanes
    let maxConcurrentExperiences = 0;
    const yearMap = new Map();
    
    // Créer une map des expériences par année
    for (const experience of sortedExperiences) {
        for (let year = experience.startYear; year <= experience.endYear; year++) {
            if (!yearMap.has(year)) {
                yearMap.set(year, []);
            }
            yearMap.get(year).push(experience);
        }
    }
    
    // Trouver l'année avec le plus d'expériences simultanées
    for (const [year, experiences] of yearMap) {
        maxConcurrentExperiences = Math.max(maxConcurrentExperiences, experiences.length);
    }
    
    // Calculer le nombre de lanes nécessaire (minimum 4, adaptatif selon les chevauchements)
    const maxLanes = Math.max(4, maxConcurrentExperiences);
    const laneWidth = 100 / maxLanes;
    
    for (const experience of sortedExperiences) {
        const duration = experience.endYear - experience.startYear + 1;
        const yearHeight = 100; // Hauteur de chaque ligne d'année
        const totalHeight = yearRange * yearHeight;
        const top = (maxYear - experience.endYear) * yearHeight;
        const height = duration * yearHeight;
        
        // Trouver la meilleure lane disponible en évitant les chevauchements
        let bestLaneIndex = -1;
        let minOverlap = Infinity;
        
        // Essayer chaque lane existante
        for (let i = 0; i < maxLanes; i++) {
            const lane = lanes[i];
            let canUse = true;
            let overlap = 0;
            
            if (lane) {
                // Vérifier si cette expérience chevauche avec la lane
                if (experience.startYear <= lane.endTime && experience.endYear >= lane.startTime) {
                    canUse = false;
                    overlap = Math.min(experience.endYear, lane.endTime) - Math.max(experience.startYear, lane.startTime) + 1;
                }
            }
            
            if (canUse) {
                bestLaneIndex = i;
                break;
            } else if (overlap < minOverlap) {
                minOverlap = overlap;
                bestLaneIndex = i;
            }
        }
        
        // Si aucune lane existante n'est disponible, créer une nouvelle
        if (bestLaneIndex === -1) {
            bestLaneIndex = lanes.length;
        }
        
        // Mettre à jour la lane
        lanes[bestLaneIndex] = {
            startTime: experience.startYear,
            endTime: experience.endYear,
            endPosition: top + height
        };
        
        // Calculer la position horizontale avec largeur adaptative
        const left = bestLaneIndex * laneWidth;
        const minWidth = Math.max(20, 100 / maxLanes); // Largeur minimale basée sur le nombre de lanes
        const width = Math.min(laneWidth * 0.9, minWidth); // Évite les cartes trop fines
        
        positioned.push({
            experience,
            top,
            height,
            left,
            width
        });
    }
    
    return {
        positioned,
        yearRange: { minYear, maxYear }
    };
} 