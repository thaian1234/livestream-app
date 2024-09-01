
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import {CardContent} from '@/components/ui/card';
export function IconLogin() {
    return (
        <CardContent className="items-center">
            <div className="flex w-full items-center">
                <div style={{ height: '1px', flexGrow: '1', backgroundColor: '#4D4D4D' }}></div>
                <span className="px-4 font-sans text-gray text-sm"> Or </span> 
                {/* chỗ này không text-gray được */}
                <div style={{ height: '1px', flexGrow: '1', backgroundColor: '#4D4D4D' }}></div>
            </div>
            <div className="flex">  
                {/* chỗ này không mt được */}
                <button style={{ marginRight: '10px' }}>
                    <FaFacebook size={30} />
                </button>
                <button style={{ marginRight: '10px' }}>
                    <FaGithub size={30} />
                </button>
                <button >
                    <FaGoogle size={30} />
                </button>
            </div>
        </CardContent>
    )
}