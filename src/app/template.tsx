'use client';

import { motion } from 'framer-motion';

const pageVariants = {
	hidden: {
		opacity: 0,
		x: -20,
	},
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			type: 'spring',
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		opacity: 0,
		x: 20,
		transition: {
			duration: 0.2,
		},
	},
};

export default function Template({ children }: { children: React.ReactNode }) {
	return (
		<motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit">
			{children}
		</motion.div>
	);
}
