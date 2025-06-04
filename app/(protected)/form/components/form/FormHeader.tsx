import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader: React.FC<HeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-8">
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
  </div>
);

export default FormHeader;