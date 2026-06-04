export function calculateBmi(height: number, weight: number): string {
    const bmi = weight / (height / 100) ** 2;
    let result;

    if (bmi < 18.5) {
        result = "Underweight";
    } else if (bmi < 25) {
        result = "Normal range";
    } else {
        result = "Overweight";
    }
    return result;
}


//console.log(calculateBmi(180, 72));

if (process.argv[1] === import.meta.filename) {
const parseBMICalculatorArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length !== 2) {
    throw new Error("Please provide exactly two arguments: height and weight");
  }

  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (Number.isNaN(height) || Number.isNaN(weight)) {
    throw new Error("Provided values were not numbers");
  }

  if (height <= 0 || weight <= 0) {
    throw new Error("Height and weight must be positive numbers");
  }

  return {
    height,
    weight,
  };
};

try {
  const { height, weight } = parseBMICalculatorArguments(process.argv.slice(2));
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Something went wrong");  
  }
}
}