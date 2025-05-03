export const donationAnimationStyles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes scaleIn {
        from {
            transform: scale(0.8);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes slideIn {
        from {
            transform: translateX(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .animate-fade-in {
        opacity: 0;
        animation: fadeIn 0.6s ease-out forwards;
        will-change: opacity, transform;
    }

    .animate-scale-in {
        opacity: 0;
        animation: scaleIn 0.5s ease-out forwards;
        will-change: opacity, transform;
    }

    .animate-slide-in {
        opacity: 0;
        animation: slideIn 0.4s ease-out forwards;
        will-change: opacity, transform;
    }

    .delay-1 {
        animation-delay: 0.1s;
    }
    .delay-2 {
        animation-delay: 0.2s;
    }
    .delay-3 {
        animation-delay: 0.3s;
    }
    .delay-4 {
        animation-delay: 0.4s;
    }
`;
