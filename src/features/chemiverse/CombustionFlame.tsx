import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CombustionLab } from './components/combustion/CombustionLab';

export const CombustionFlame = () => {
    const navigate = useNavigate();
    return (
        <div className='h-full flex flex-col bg-white text-gray-900 font-sans overflow-hidden'>
            <div className='absolute top-6 left-6 z-20 flex items-center gap-4'>
                <Button variant='ghost' onClick={() => navigate('/chemistry')} className='px-2 text-gray-700 hover:bg-gray-100'>
                    <ArrowLeft className='w-8 h-8' />
                </Button>
                <div>
                    <h1 className='text-4xl font-black text-gray-900'>COMBUSTION & FLAME</h1>
                    <p className='text-gray-500 font-bold text-sm uppercase tracking-widest mt-1'>
                        Interactive Lab
                    </p>
                </div>
            </div>
            <div className='flex-1 relative h-full pt-24'>
                <CombustionLab />
            </div>
        </div>
    );
};
