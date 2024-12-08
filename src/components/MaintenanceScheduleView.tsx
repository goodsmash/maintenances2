import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Tool,
  ClipboardList
} from "lucide-react";
import type { MaintenanceSchedule, MaintenanceTask } from '../data/maintenanceSchedules';

interface MaintenanceScheduleViewProps {
  schedule: MaintenanceSchedule;
  onTaskComplete?: (taskId: string) => void;
}

export function MaintenanceScheduleView({
  schedule,
  onTaskComplete
}: MaintenanceScheduleViewProps) {
  const getPriorityColor = (priority: MaintenanceTask['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyColor = (frequency: MaintenanceTask['frequency']) => {
    switch (frequency) {
      case 'daily':
        return 'bg-blue-100 text-blue-800';
      case 'weekly':
        return 'bg-purple-100 text-purple-800';
      case 'monthly':
        return 'bg-pink-100 text-pink-800';
      case 'quarterly':
        return 'bg-orange-100 text-orange-800';
      case 'biannual':
        return 'bg-teal-100 text-teal-800';
      case 'annual':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const groupTasksByFrequency = () => {
    const grouped: Record<string, MaintenanceTask[]> = {};
    schedule.tasks.forEach(task => {
      if (!grouped[task.frequency]) {
        grouped[task.frequency] = [];
      }
      grouped[task.frequency].push(task);
    });
    return grouped;
  };

  const groupedTasks = groupTasksByFrequency();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{schedule.name}</CardTitle>
        <p className="text-gray-600">{schedule.description}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {Object.entries(groupedTasks).map(([frequency, tasks]) => (
                <div key={frequency} className="space-y-4">
                  <h3 className="font-medium text-lg capitalize">
                    {frequency} Tasks
                  </h3>
                  <div className="grid gap-4">
                    {tasks.map(task => (
                      <Card key={task.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{task.title}</h4>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                              <Badge className={getFrequencyColor(task.frequency)}>
                                {task.frequency}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{task.estimatedTime}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{task.description}</p>

                          <div className="space-y-4">
                            <div>
                              <h5 className="font-medium mb-2 flex items-center">
                                <ClipboardList className="h-4 w-4 mr-2" />
                                Steps
                              </h5>
                              <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {task.steps.map((step, index) => (
                                  <li key={index}>{step}</li>
                                ))}
                              </ul>
                            </div>

                            {task.tools && (
                              <div>
                                <h5 className="font-medium mb-2 flex items-center">
                                  <Tool className="h-4 w-4 mr-2" />
                                  Required Tools
                                </h5>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {task.tools.map((tool, index) => (
                                    <li key={index}>{tool}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {task.notes && (
                              <div>
                                <h5 className="font-medium mb-2 flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Notes
                                </h5>
                                <ul className="list-disc list-inside space-y-1 text-gray-600">
                                  {task.notes.map((note, index) => (
                                    <li key={index}>{note}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {onTaskComplete && (
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => onTaskComplete(task.id)}
                                className="flex items-center space-x-2 text-green-600 hover:text-green-700"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Mark Complete</span>
                              </button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="upcoming">
            {/* Implementation for upcoming tasks */}
          </TabsContent>

          <TabsContent value="completed">
            {/* Implementation for completed tasks */}
          </TabsContent>

          <TabsContent value="overdue">
            {/* Implementation for overdue tasks */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
