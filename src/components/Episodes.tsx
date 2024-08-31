import codegeassImage from "../../public/images/codegeassF.jpg"; 
import Image from 'next/image';

function Episodes() {
    return (
        <>
        <div className="flex flex-col mb-12 w-full ">
            
        </div>
        <div className="container mx-auto">{/* Centering the entire content */}
            <div className="flex flex-col mb-12 w-full text-white text-4xl   font-bold mt-4 justify-start">
                Latest Releases
            </div>
                <div className="grid grid-cols-3 gap-x-8 gap-y-4 bg-custom-blue-dark "> {/* px-4 adds padding to prevent images from touching the screen edges */}
                    <div className="flex flex-col items-center">
                        <Image
                            src={codegeassImage} 
                            alt="Code Geass"
                            style={{ objectFit: "cover" }} 
                            priority={false}
                        />
                        <h2 className="text-white text-xl font-bold mt-4">Code Geass</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src={codegeassImage} 
                            alt="Code Geass"
                            style={{ objectFit: "cover" }} 
                            priority={false}
                        />
                        <h2 className="text-white text-xl font-bold mt-4">Code Geass</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src={codegeassImage} 
                            alt="Code Geass"
                            style={{ objectFit: "cover" }} 
                            priority={false}
                        />
                        <h2 className="text-white text-xl font-bold mt-4">Code Geass</h2>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src={codegeassImage} 
                            alt="Code Geass"
                            style={{ objectFit: "cover" }} 
                            priority={false}
                        />
                        <h2 className="text-white text-xl font-bold mt-4">Code Geass</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Episodes;
