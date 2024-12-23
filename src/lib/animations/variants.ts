import type { Variants } from 'framer-motion';

export const fadeIn: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
};

export const slideIn: Variants = {
	hidden: { x: -20, opacity: 0 },
	visible: { x: 0, opacity: 1 },
};

export const scaleIn: Variants = {
	hidden: { scale: 0.95, opacity: 0 },
	visible: { scale: 1, opacity: 1 },
};

export const listItem: Variants = {
	hidden: { opacity: 0, x: -20 },
	visible: { opacity: 1, x: 0 },
	removed: { opacity: 0, x: 20 },
};

export const staggerChildren = {
	visible: {
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export const modalVariants: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.95,
		y: 10,
	},
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: 'spring',
			duration: 0.3,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		y: 10,
		transition: {
			duration: 0.2,
		},
	},
};
