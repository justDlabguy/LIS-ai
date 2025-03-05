import { useToast as useToastOriginal } from '@/components/ui/use-toast';

export function useToast() {
  const { toast } = useToastOriginal();

  return {
    toast: (props: {
      title: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      toast({
        ...props,
        duration: 3000,
      });
    },
  };
} 