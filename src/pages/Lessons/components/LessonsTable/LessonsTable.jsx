import React from "react";
import LessonsTableRow from "../LessonsTableRow/LessonsTableRow";

const LessonsTable = ({ data, setDataToEdit, deleteData }) => {
  return (
    <div className="table__container">
      <table className="table">
        <thead>
          <tr>
            <th>Días</th>
            <th>Horario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3">Sin datos</td>
            </tr>
          ) : (
            data.map((el) => (
              <LessonsTableRow
                key={el.id}
                el={el}
                setDataToEdit={setDataToEdit}
                deleteData={deleteData}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LessonsTable;
