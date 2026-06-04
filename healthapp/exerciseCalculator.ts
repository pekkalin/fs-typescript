
    interface trainingResult {
        periodLength: number,
        trainingDays: number,
        success: boolean,
        rating: number,
        ratingDescription: string,
        target: number,
        average: number
    }
    export function calculateExercises(dailyExercises: number[]): trainingResult {
        const [target, ...exerciseHours] = dailyExercises;
        const periodLength = exerciseHours.length;
        const average = exerciseHours.reduce((a, b) => a + b, 0) / exerciseHours.length;
        const success = exerciseHours.every(d => d >=  target);
        let rating;

        if (average >= target) {
            rating = 3;
        } else if (average < target && average > 0.5) {
            rating = 2;
        } else {
            rating = 1;
        }

        const ratingDescription = rating === 3 ? 'excellent' : rating === 2 ? 'not too bad but could be better' : 'not good';

        return {
            periodLength,
            trainingDays: exerciseHours.filter(d => d > 0).length,
            success,
            rating,
            ratingDescription,
            target,
            average
        };
    }

    //const result = calculateExercises([0, 0, 0, 0, 1, 1, 1]);
    //console.log(result);
    if (process.argv[1] === import.meta.filename) {
    const parseExerciseCalculatorArguments = (args: string[]): number[] => {
        if (args.length === 0) {
            throw new Error("Please provide daily exercise hours");
        }

        const values = args.map((arg) => Number(arg));

        if (values.some((value) => Number.isNaN(value))) {
            throw new Error("Provided values were not numbers");
        }

        return values;
        };

        try {
            const dailyExercises = parseExerciseCalculatorArguments(process.argv.slice(2));
            const result = calculateExercises(dailyExercises);

            console.log(result);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error("Something went wrong");
            }
    };
}
