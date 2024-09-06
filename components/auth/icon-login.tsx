
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import {CardContent} from '@/components/ui/card';
export function IconLogin() {
    return (
        <CardContent className="items-center">
            <div className="flex w-full items-center">
                <div className="h-0.5 grow bg-gray"></div>
                <span className="px-4 font-sans text-gray"> Or </span> 
                <div className="h-0.5 grow bg-gray"></div>
            </div>
            <div className="flex">  
                <button className='mr-4'>
                    <FaFacebook size={35} />
                </button>
                <button className='mr-4'>
                    <FaGithub size={35} />
                </button>
                <button >
                    <FaGoogle size={35} />
                </button>
            </div>
        </CardContent>
    )
}