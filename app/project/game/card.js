"use client";

export default function Card({ name, image, onSelect, state, index }) {
  const handleClick = () => {
    onSelect(name, state, index);
  };

  return (
    <div className={"mx-2"} onClick={handleClick}>
      <img
        className={state === "U" ? "mt-20" : "border-2 border-blue-500"}
        src={image}
        alt={`Card: ${name}`}
      />
      <p>{name}</p>
      <p>{state}</p>
    </div>
  );
}
