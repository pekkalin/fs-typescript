import type { CoursePart } from "./types";

interface CoursePartProp {
    part: CoursePart;
}


const Part = (props: CoursePartProp) => {
        switch (props.part.kind) {
                case "basic":
                    return (
                        <div>
                            <p><b>{props.part.name} {props.part.exerciseCount}</b></p>
                            <p>{props.part.description}</p>
                        </div>
                    );
                    
                case "group":
                    return (
                        <div>
                            <p><b>{props.part.name} {props.part.exerciseCount}</b></p>
                            <p>project exercises {props.part.groupProjectCount}</p>
                        </div>
                    );
                
                case "background":
                    return (
                        <div>
                            <p><b>{props.part.name} {props.part.exerciseCount}</b></p>
                            <p>submit to {props.part.backgroundMaterial}</p>
                            <p>{props.part.description}</p>
                        </div>
                    );

                 case "special":
                    return (
                        <div>
                            <p><b>{props.part.name} {props.part.exerciseCount}</b></p>
                            <p>required skils: {props.part.requirements}</p>
                            <p>{props.part.description}</p>
                        </div>
                    );
                default:
                    break;
            }}
        


export default Part;