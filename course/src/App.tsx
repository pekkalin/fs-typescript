import Header from "./Header";
import Content from "./Content";
import Total from "./Total";
import { courseParts } from "./data";

const App = () => {
  const courseName = "Half Stack application development";

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} /> 
      <Content courseParts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};

export default App;