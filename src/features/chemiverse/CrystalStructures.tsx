import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CrystalStructures = () => {
    const navigate = useNavigate();
    return (
        <div className='h-full flex flex-col p-6'>
            <div className='flex items-center gap-4 mb-6'>
                <Button variant='ghost' onClick={() => navigate('/chemistry')} className='px-2'>
                    <ArrowLeft className='w-6 h-6' />
                </Button>
                <h1 className='text-3xl font-bold'>CrystalStructures</h1>
            </div>
            <div className='flex-1 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                <p className='text-xl text-gray-500'>Module Under Construction</p>
            </div>
        </div>
    );
};
