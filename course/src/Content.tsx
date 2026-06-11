import type { CoursePart } from './types'
import Part from './Part';

interface CourseProps {
  courseParts: CoursePart[];
}

const Content = (props: CourseProps) => {
    return (
    <div>
       {props.courseParts.map(part => (
        <p key={part.name}>
          <Part part={part}/>
        </p>
      ))}
    </div>
)};

export default Content