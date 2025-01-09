// index.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.replace('./verifFirebase');
        }, 0); // Utilisation de setTimeout pour attendre le montage complet
    }, []);

    return null; // Rien à afficher car la redirection est immédiate
}


