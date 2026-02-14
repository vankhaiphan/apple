import Fruit from './Fruit';

export default function Fruits({ letters }) {
  return (
    <group>
      {letters.map((letter) => (
        <Fruit key={letter.id} letter={letter} />
      ))}
    </group>
  );
}
