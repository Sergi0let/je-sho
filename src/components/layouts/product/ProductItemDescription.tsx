import useCleanup from "../../../../hooks/useCleanup";

interface Props {
  content: string;
}

const ProductItemDescription = ({ content }: Props) => {
  const { measurements, generalDescription } = useCleanup(content);
  return (
    <div className="text-gray-dark space-y-4 text-sm md:text-base">
      <div>
        {generalDescription.map((line, index) => (
          <p key={index} className="mb-1">
            {line}
          </p>
        ))}
      </div>
      {measurements.length > 0 && (
        <div>
          <h3 className="mb-2 text-lg font-semibold">Заміри:</h3>
          <div className="space-y-4">
            {measurements.map((measurement, index) => (
              <div key={index}>
                <h4 className="text-gray-dark font-semibold">
                  {measurement.size}
                </h4>
                <ul className="text-gray-dark list-inside list-disc text-sm">
                  {measurement.details.map((detail, detailIndex) => (
                    <li key={detailIndex}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductItemDescription;
