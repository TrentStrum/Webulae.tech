'use client';
import { AboutPage } from './components/AboutPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About',
	description: 'About page'
}

export default function About() {
	return <AboutPage />;
}
