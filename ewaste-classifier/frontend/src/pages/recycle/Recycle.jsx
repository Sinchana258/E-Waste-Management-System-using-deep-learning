import React from "react";
import { FiSmartphone, FiHeadphones, FiTv } from "react-icons/fi";
import { RiFridgeFill } from "react-icons/ri";
import { FaLaptop } from "react-icons/fa";
import { MdOutlineDevicesOther } from "react-icons/md";

const PRIMARY = "#5A8807";
const PRIMARY_LIGHT = "#E8F5D4";

const Recycle = () => {
  const recycleItems = [
    {
      itemName: "Smartphone",
      description:
        "Responsibly recycle your outdated or non-functional smartphones and recover valuable materials while protecting the environment.",
      recyclingProcess:
        "Our certified process includes data wiping, component dismantling, precious metal recovery, and safe disposal of hazardous materials.",
      specialInstructions:
        "Back up and factory reset your device to remove personal data. Remove SIM cards and memory cards before recycling.",
      benefits:
        "Recycling one smartphone can recover enough precious metals to prevent mining 80 kg of earth.",
      icon: <FiSmartphone size={48} style={{ color: PRIMARY }} />,
    },
    {
      itemName: "Laptop",
      description:
        "Give your old laptops and computers a sustainable afterlife through our specialized electronics recycling program.",
      recyclingProcess:
        "We implement secure data destruction, component disassembly, circuit board processing, and proper management of LCD screens and batteries.",
      specialInstructions:
        "Back up important files, perform a secure wipe of all storage drives, and remove external batteries before recycling.",
      benefits:
        "Recycling laptops can recover 95% of valuable metals including gold, silver, and rare earth elements.",
      icon: <FaLaptop size={48} style={{ color: PRIMARY }} />,
    },
    {
      itemName: "Accessories",
      description:
        "Properly dispose of cables, chargers, headphones, keyboards, and other electronic accessories.",
      recyclingProcess:
        "We sort accessories by material type, separate metal components, process plastics, and safely handle hazardous materials.",
      specialInstructions:
        "Bundle similar accessories together for easier processing and ensure batteries are removed from wireless devices.",
      benefits:
        "Recycling accessories prevents toxic materials from entering landfills.",
      icon: <FiHeadphones size={48} style={{ color: PRIMARY }} />,
    },
    {
      itemName: "Television",
      description:
        "Recycle your old TVs and monitors responsibly using our certified recycling process.",
      recyclingProcess:
        "Includes screen separation, hazardous material containment, and component recovery.",
      specialInstructions:
        "Transport with screen facing down to prevent cracks and include remote/cables when possible.",
      benefits:
        "Prevents mercury, lead, and harmful chemicals from contaminating the environment.",
      icon: <FiTv size={48} style={{ color: PRIMARY }} />,
    },
    {
      itemName: "Refrigerator",
      description:
        "Recycle refrigerators safely with proper extraction of refrigerants and recovery of metals/plastics.",
      recyclingProcess:
        "Includes refrigerant extraction, insulation recovery, and segregation of metal components.",
      specialInstructions:
        "Clean & defrost completely before recycling. Remove shelves & food.",
      benefits:
        "Prevents release of high-impact greenhouse gases and recovers important metals.",
      icon: <RiFridgeFill size={48} style={{ color: PRIMARY }} />,
    },
    {
      itemName: "Other",
      description:
        "Recycle any electronic device through our comprehensive e-waste management program.",
      recyclingProcess:
        "Assessment, dismantling, component sorting, material recovery, and safe disposal.",
      specialInstructions:
        "Include manuals, boxes, and accessories when available.",
      benefits:
        "Ensures uncommon electronics are responsibly processed rather than trashed.",
      icon: <MdOutlineDevicesOther size={48} style={{ color: PRIMARY }} />,
    },
  ];

  return (
    <>
      <div className="section container mx-auto px-8 pt-8 recycle-container">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: PRIMARY }}>
            Sustainable Electronics Recycling Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the right recycling option for your devices and support a
            greener, safer environment.
          </p>
        </div>

        {/* Recycling Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recycleItems.map((item, index) => (
            <RecycleCard key={index} PRIMARY={PRIMARY} {...item} />
          ))}
        </div>

        {/* Bottom Section */}
        <div
          className="mt-20 rounded-lg p-8"
          style={{ backgroundColor: PRIMARY_LIGHT }}
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold" style={{ color: PRIMARY }}>
              Why Recycle Electronics With ECycle?
            </h3>
            <p className="text-gray-700 mt-2">
              Our approach ensures responsible handling of your e-waste.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "Certified Process",
                text:
                  "Strict environmental protocols ensure safe and compliant recycling.",
              },
              {
                title: "Data Security",
                text: "Guaranteed destruction of personal and sensitive data.",
              },
              {
                title: "Resource Recovery",
                text:
                  "Maximum extraction of valuable materials prevents unnecessary mining.",
              },
              {
                title: "Effortless Process",
                text:
                  "Simple scheduling makes recycling quick and convenient.",
              },
            ].map((info, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm text-center"
              >
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: PRIMARY_LIGHT }}
                >
                  <div className="text-3xl" style={{ color: PRIMARY }}>
                    ●
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2">{info.title}</h4>
                <p className="text-gray-700 text-sm">{info.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const RecycleCard = ({
  itemName,
  description,
  recyclingProcess,
  specialInstructions,
  benefits,
  icon,
  PRIMARY,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
      <div className="p-6 flex justify-center items-center" style={{ backgroundColor: PRIMARY_LIGHT }}>
        <div className="bg-white rounded-full p-4 shadow-sm">{icon}</div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold mb-3" style={{ color: PRIMARY }}>
          {itemName}
        </h3>

        <p className="text-gray-700 mb-4">{description}</p>

        <div className="flex-grow mb-4">
          <Section title="Recycling Process" color={PRIMARY} text={recyclingProcess} />
          <Section title="Special Instructions" color={PRIMARY} text={specialInstructions} />
          <Section title="Environmental Benefits" color={PRIMARY} text={benefits} />
        </div>

        <a
          href={`/recycle/${itemName.toLowerCase()}`}
          className="w-full py-3 px-4 text-white font-medium rounded-md text-center transition"
          style={{ backgroundColor: PRIMARY }}
        >
          Recycle {itemName} Now
        </a>
      </div>
    </div>
  );
};

const Section = ({ title, text, color }) => (
  <div className="mb-3">
    <h4 className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color }}>
      {title}
    </h4>
    <p className="text-gray-700 text-sm">{text}</p>
  </div>
);

export default Recycle;
