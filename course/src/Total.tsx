
interface TotalProps {
    total: number
}
const Total = (total: TotalProps) => {
    return (
        <div>
            <p>Total number of exercises {total.total}</p>
        </div>
    );
};

export default Total