import React from 'react';

interface DropDownProps {
  items: string[];
  title: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string; //
}

function DropDown({ items, title, onChange, value }: DropDownProps) {
  const options = items.map(item => <option  key={item} value={item} >{item || "-- select an option --"}</option>);
  return (
    <label>
      {title}:
      <select name="choices" onChange={onChange ?? (() => {})} value={value}>
        {options}
      </select>
    </label>
  );
}


// function DropDown({ items, title, onChange, value }: DropDownProps) {
//   const options = items.map((item) => (
//     <option key={item} value={item}>
//       {item || "-- select an option --"}
//     </option>
//   ));

//   return (
//     <label>
//       {title}:{" "}
//       <select name="choices" onChange={onChange} value={value}>
//         {options}
//       </select>
//     </label>
//   );
// }

export default DropDown;