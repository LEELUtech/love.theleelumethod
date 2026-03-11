import { ErrorIcon } from '@/components/icons';
import { Modal } from 'antd';
import Button from '../Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

export const ErrorModal = ({ isOpen, onClose, message, title = 'Something went wrong' }: Props) => {
  return (
    <Modal open={isOpen} onCancel={onClose} footer={null} centered closable={{ 'aria-label': 'Close' }}>
      <div className='py-4 text-center'>
        <div className='flex justify-center mb-4'>
          <div className='w-12 h-12 rounded-full bg-[#F9ECED] flex items-center justify-center'>
            <ErrorIcon />
          </div>
        </div>
        <h2 className='font-canela font-light text-[24px] text-brand-black mb-2'>{title}</h2>
        <p className='font-lato text-[14px]/[1.6] text-[#757986] mb-6'>{message}</p>

        <Button onClick={onClose} className='w-full max-w-[350px]'>
          Try Again
        </Button>
      </div>
    </Modal>
  );
};
