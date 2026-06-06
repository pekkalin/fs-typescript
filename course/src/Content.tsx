import type { CoursePart } from './types'

interface CourseProps {
  courseParts: CoursePart[];
}

const Content = (props: CourseProps) => {
    return (
    <div>
       {props.courseParts.map(part => (
        <p key={part.name}>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </div>
)};

export default Content