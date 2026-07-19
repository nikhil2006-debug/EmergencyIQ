// lib/scenarios.ts

export type Scenario = {
    label: string;
    lines: string[];
};

export const scenarios: Record<string, Scenario> = {
    cardiac: {
        label: "Cardiac Emergency",
        lines: [
            "Please help, my father just collapsed!",
            "He's not moving, he's not responding to me at all!",
            "He has diabetes, I don't know if that matters right now!",
            "I don't think he has a pulse, I can't feel anything, please hurry!",
            "We're at 42 Lincoln Street, second floor, please send someone now!",
        ],
    },
    fire: {
        label: "Structure Fire",
        lines: [
            "There's a fire in my building, there's smoke everywhere, please help!",
            "I think someone's still on the third floor, I can hear them yelling!",
            "The stairwell is filling with smoke, I can't get up there to help them!",
            "I'm outside now at the corner of 5th and Main, but I don't know if they got out!",
        ],
    },
    roadAccident: {
        label: "Road Accident",
        lines: [
            "There's been a bad crash on the highway, two cars, please send help!",
            "Someone's trapped inside one of the cars, and the other driver is bleeding and walking around confused!",
            "I can smell gasoline, I'm scared it's going to catch fire!",
            "We're near mile marker 14 on Route 9, please hurry!",
        ],
    },
};