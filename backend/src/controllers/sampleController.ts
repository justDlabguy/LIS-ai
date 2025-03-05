import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a new sample
export const createSample = async (req: Request, res: Response) => {
  try {
    const { patientName, patientId, barcode } = req.body;
    const userId = req.user!.id;

    const sample = await prisma.sample.create({
      data: {
        patientName,
        patientId,
        barcode,
        userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Sample created successfully',
      sample,
    });
  } catch (error) {
    console.error('Error creating sample:', error);
    res.status(500).json({ message: 'Error creating sample' });
  }
};

// Get all samples
export const getAllSamples = async (req: Request, res: Response) => {
  try {
    const samples = await prisma.sample.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        testResults: true,
      },
    });

    res.json(samples);
  } catch (error) {
    console.error('Error fetching samples:', error);
    res.status(500).json({ message: 'Error fetching samples' });
  }
};

// Get sample by ID
export const getSampleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sample = await prisma.sample.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        testResults: true,
      },
    });

    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    res.json(sample);
  } catch (error) {
    console.error('Error fetching sample:', error);
    res.status(500).json({ message: 'Error fetching sample' });
  }
};

// Update sample status
export const updateSampleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedSample = await prisma.sample.update({
      where: { id },
      data: { status },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        testResults: true,
      },
    });

    res.json({
      message: 'Sample status updated successfully',
      sample: updatedSample,
    });
  } catch (error) {
    console.error('Error updating sample status:', error);
    res.status(500).json({ message: 'Error updating sample status' });
  }
};

// Delete sample
export const deleteSample = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.sample.delete({
      where: { id },
    });

    res.json({ message: 'Sample deleted successfully' });
  } catch (error) {
    console.error('Error deleting sample:', error);
    res.status(500).json({ message: 'Error deleting sample' });
  }
}; 