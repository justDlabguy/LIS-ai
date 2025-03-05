import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Create a new test result
export const createTestResult = async (req: Request, res: Response) => {
  try {
    const { sampleId, testType, rawData } = req.body;

    // Create test result
    const testResult = await prisma.testResult.create({
      data: {
        sampleId,
        testType,
        rawData,
        status: 'PENDING',
      },
    });

    // Send data to AI service for analysis
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
        testType,
        rawData,
      });

      // Update test result with AI analysis
      const updatedTestResult = await prisma.testResult.update({
        where: { id: testResult.id },
        data: {
          aiAnalysis: aiResponse.data,
          status: 'COMPLETED',
        },
      });

      res.status(201).json({
        message: 'Test result created successfully',
        testResult: updatedTestResult,
      });
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      
      // Update test result status to failed if AI analysis fails
      await prisma.testResult.update({
        where: { id: testResult.id },
        data: {
          status: 'FAILED',
        },
      });

      res.status(201).json({
        message: 'Test result created but AI analysis failed',
        testResult,
      });
    }
  } catch (error) {
    console.error('Error creating test result:', error);
    res.status(500).json({ message: 'Error creating test result' });
  }
};

// Get all test results for a sample
export const getTestResults = async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;

    const testResults = await prisma.testResult.findMany({
      where: { sampleId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ message: 'Error fetching test results' });
  }
};

// Get test result by ID
export const getTestResultById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const testResult = await prisma.testResult.findUnique({
      where: { id },
      include: {
        sample: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    res.json(testResult);
  } catch (error) {
    console.error('Error fetching test result:', error);
    res.status(500).json({ message: 'Error fetching test result' });
  }
};

// Update test result
export const updateTestResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rawData } = req.body;

    // Update test result
    const updatedTestResult = await prisma.testResult.update({
      where: { id },
      data: {
        rawData,
        status: 'IN_PROGRESS',
      },
    });

    // Re-run AI analysis
    try {
      const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/analyze`, {
        testType: updatedTestResult.testType,
        rawData,
      });

      const finalTestResult = await prisma.testResult.update({
        where: { id },
        data: {
          aiAnalysis: aiResponse.data,
          status: 'COMPLETED',
        },
      });

      res.json({
        message: 'Test result updated successfully',
        testResult: finalTestResult,
      });
    } catch (aiError) {
      console.error('AI analysis error:', aiError);
      
      const failedTestResult = await prisma.testResult.update({
        where: { id },
        data: {
          status: 'FAILED',
        },
      });

      res.json({
        message: 'Test result updated but AI analysis failed',
        testResult: failedTestResult,
      });
    }
  } catch (error) {
    console.error('Error updating test result:', error);
    res.status(500).json({ message: 'Error updating test result' });
  }
};

// Delete test result
export const deleteTestResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.testResult.delete({
      where: { id },
    });

    res.json({ message: 'Test result deleted successfully' });
  } catch (error) {
    console.error('Error deleting test result:', error);
    res.status(500).json({ message: 'Error deleting test result' });
  }
}; 