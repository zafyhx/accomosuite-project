import React from 'react';
import UnderConstruction from '../components/UnderConstruction'; // Sesuaikan path jika berbeda

const Hotel = () => {
  return (
    <div className="container mx-auto p-4 py-8">
      {/* Kita panggil komponen placeholder di sini */}
      <UnderConstruction pageName="Halaman Hotel" />
    </div>
  );
};

export default Hotel;